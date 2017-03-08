base_url="http://ec2-23-20-138-216.compute-1.amazonaws.com:8090/controller/rest/applications/AD-Capital"

auth="amodgupta@customer1:welcome-101"

IFS=$'\n'

function traverse() {
    local root="$1"

    # Fetch one level of metric info
    local result="$(curl -s -u "$auth" "$base_url/metrics?output=json&metric-path=${root// /%20}")"

    # Print the "leaves" (AKA metrics)
    for leaf in $(echo "$result" | jq '.[] | select(.type=="leaf") | .name'); do
        echo "$root|$leaf"
    done

    # Recur on the folders
    local next_folders="$(echo "$result" | jq -r '.[] | select(.type=="folder") | .name')"
    for folder in $next_folders; do
        if [[ -z "$root" ]]; then
            traverse "$folder"
        else
            traverse "$root|$folder"
        fi
    done

    # Don't DOS the server for now
    sleep 1
}

traverse ""
